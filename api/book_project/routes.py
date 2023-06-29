from flask import request, jsonify
from sqlalchemy import func
from book_project import app, db
from datetime import date
from dateutil import parser
from book_project.models import Book, Member, Transaction


# Routes
@app.route('/')
def index():
    return 'Welcome to the Library Management System'


@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    book_data = [{'id': book.id, 'title': book.title, 'author': book.author, 'stock': book.stock} for book in books]
    return jsonify(book_data)

@app.route('/books', methods=['POST'])
def add_book():
    book_data = request.get_json()
    title = book_data['title']
    author = book_data['author']
    stock = book_data['stock']

    book = Book(title=title, author=author, stock=stock)
    db.session.add(book)
    db.session.commit()

    return jsonify({'message': 'Book added successfully'})

@app.route('/books/<int:book_id>', methods=['GET'])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    book_data = {'id': book.id, 'title': book.title, 'author': book.author, 'stock': book.stock}
    return jsonify(book_data)

@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404
    
    book_data = request.get_json()
    if not book_data:
        return jsonify({'message': 'No data provided'}), 400
    
    # Update the book properties if they exist in the book_data dictionary
    if 'title' in book_data:
        book.title = book_data['title']
    if 'author' in book_data:
        book.author = book_data['author']
    if 'publication_date' in book_data:
        book.publication_date = book_data['publication_date']
    
    db.session.commit()
    
    return jsonify({'message': 'Book updated successfully'})


@app.route('/books/<int:book_id>', methods=['DELETE'])
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()

    return jsonify({'message': 'Book deleted successfully'})

@app.route('/members', methods=['GET'])
def get_members():
    members = Member.query.all()
    member_data = [{'id': member.id, 'name': member.name, 'email': member.email, 'phone_number': member.phone_number} for member in members]
    return jsonify(member_data)

@app.route('/members', methods=['POST'])
def add_member():
    member_data = request.get_json()
    name = member_data['name']
    email = member_data['email']
    phone_number = member_data['phone_number']

    member = Member(name=name, email=email, phone_number=phone_number)
    db.session.add(member)
    db.session.commit()

    return jsonify({'message': 'Member added successfully'})

@app.route('/members/<int:member_id>', methods=['GET'])
def get_member(member_id):
    member = Member.query.get_or_404(member_id)
    member_data = {'id': member.id, 'name': member.name, 'email': member.email, 'phone_number': member.phone_number}
    return jsonify(member_data)

@app.route('/members/<int:member_id>', methods=['PUT'])
def update_member(member_id):
    member = Member.query.get_or_404(member_id)
    member_data = request.get_json()
    member.name = member_data['name']
    member.email = member_data['email']
    member.phone_number = member_data['phone_number']


    db.session.commit()

    return jsonify({'message': 'Member updated successfully'})

@app.route('/members/<int:member_id>', methods=['DELETE'])
def delete_member(member_id):
    member = Member.query.get_or_404(member_id)
    db.session.delete(member)
    db.session.commit()

    return jsonify({'message': 'Member deleted successfully'})

@app.route('/transactions/<int:transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
        transaction = Transaction.query.get_or_404(transaction_id)
        book = Book.query.get(transaction.book_id)
        member = Member.query.get(transaction.member_id)
            
        transaction_data = {
            'id': transaction.id,
            'book': {'id': book.id, 'title': book.title},
            'member': {'id': member.id, 'name': member.name},
            'issue_date': transaction.issue_date.isoformat(),
            'return_date': transaction.return_date.isoformat() if transaction.return_date else None,
            'fee': transaction.fee
        }
            
        return jsonify(transaction_data)


@app.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    transaction_data = []
    for transaction in transactions:
        book = Book.query.get(transaction.book_id)
        member = Member.query.get(transaction.member_id)
        data = {
            'id': transaction.id,
            'book': {'id': book.id, 'title': book.title},
            'member': {'id': member.id, 'name': member.name},
            'issue_date': transaction.issue_date.isoformat(),
            'return_date': transaction.return_date.isoformat() if transaction.return_date else None,
            'fee': transaction.fee
        }
        transaction_data.append(data)
    return jsonify(transaction_data)

@app.route('/transactions', methods=['POST'])
def add_transaction():
    transaction_data = request.get_json()
    book_id = transaction_data.get('book_id')
    member_id = transaction_data.get('member_id')
    issue_date_str = transaction_data.get('issue_date')
    return_date_str = transaction_data.get('return_date')

    if not all([book_id, member_id, issue_date_str]):
        return jsonify({'error': 'Invalid transaction data'})

    issue_date = parser.parse(issue_date_str).date()
    return_date = parser.parse(return_date_str).date() if return_date_str else date.today()

    # Calculate the number of days
    days_diff = (return_date - issue_date).days

    # Calculate the fee based on the number of days
    fee = 50 * days_diff

    # Generate the transaction id
    max_id = db.session.query(func.max(Transaction.id)).scalar()
    transaction_id = max_id + 1 if max_id is not None else 1

    book = Book.query.get(book_id)
    member = Member.query.get(member_id)

    if book is None or member is None:
        return jsonify({'error': 'Invalid book_id or member_id'})

    if book.stock > 0:
        # Issue book to member with the proper index
        transaction = Transaction(
            id=transaction_id,
            book_id=book_id,
            member_id=member_id,
            issue_date=issue_date,
            return_date=return_date,
            fee=fee
        )
        db.session.add(transaction)

        # Update stock count
        book.stock -= 1

        db.session.commit()
        return jsonify({'message': 'Book issued successfully', 'fee': fee})
    else:
        return jsonify({'error': 'Book is out of stock'})


@app.route('/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    transaction = Transaction.query.get(transaction_id)

    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404

    data = request.get_json()

    if 'issue_date' in data:
        issue_date_str = data['issue_date']
        try:
            issue_date = parser.parse(issue_date_str).date()
        except (ValueError, TypeError):
            return jsonify({'message': 'Invalid issue_date format'}), 400
        transaction.issue_date = issue_date

    if 'return_date' in data:
        return_date_str = data['return_date']
        try:
            return_date = parser.parse(return_date_str).date()
        except (ValueError, TypeError):
            return jsonify({'message': 'Invalid return_date format'}), 400
        transaction.return_date = return_date

    if 'fee' in data:
        transaction.fee = data['fee']

    db.session.commit()

    return jsonify({'message': 'Transaction updated successfully'})


@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)

    # Get associated book and member
    book = Book.query.get(transaction.book_id)
    member = Member.query.get(transaction.member_id)

    # Delete the transaction
    db.session.delete(transaction)

    # Update stock count
    book.stock += 1

    db.session.commit()
    return jsonify({'message': 'Transaction deleted successfully'})

@app.route('/transactions', methods=['DELETE'])
def delete_all_transactions():
    # Delete all transactions
    Transaction.query.delete()

    # Reset stock count for all books
    books = Book.query.all()
    for book in books:
        transactions = Transaction.query.filter_by(book_id=book.id).all()
        stock_count = len(transactions)
        book.stock = stock_count

    db.session.commit()
    return jsonify({'message': 'All transactions deleted successfully and books restocked'})



@app.route('/transactions/<int:transaction_id>', methods=['POST'])
def return_book(transaction_id):
    transaction = Transaction.query.get_or_404(transaction_id)

    if transaction.return_date is None:
        # Calculate fee based on return date
        return_date = date.today()
        transaction.return_date = return_date
        days_issued = (return_date - transaction.issue_date).days
        transaction.fee = 50 * days_issued

        # Update stock count only if the book has not been returned
        book = Book.query.get(transaction.book_id)
        if book is not None and not transaction.returned:
            book.stock += 1
            transaction.returned = True

        db.session.commit()
        return jsonify({'message': 'Book returned successfully', 'book': {'id': book.id, 'title': book.title}})
    else:
        return jsonify({'error': 'Book has already been returned'})

@app.route('/books/<int:book_id>/return', methods=['POST'])
def return_book_to_stock(book_id):
    book = Book.query.get_or_404(book_id)
    book.stock += 1
    db.session.commit()
    return jsonify({'message': 'Book added back to stock successfully'})


