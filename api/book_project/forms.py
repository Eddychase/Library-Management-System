from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, SelectField
from wtforms.validators import DataRequired

# Flask forms
class BookForm(FlaskForm):
    title = StringField('Title', validators=[DataRequired()])
    author = StringField('Author', validators=[DataRequired()])
    stock = IntegerField('Stock', validators=[DataRequired()])

class MemberForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])

class TransactionForm(FlaskForm):
    book_id = SelectField('Book', coerce=int, validators=[DataRequired()])
    member_id = SelectField('Member', coerce=int, validators=[DataRequired()])
    issue_date = DateField('Issue Date', validators=[DataRequired()])
    return_date = DateField('Return Date')

    def populate_choices(self):
        self.book_id.choices = [(book.id, book.title) for book in Book.query.all()]
        self.member_id.choices = [(member.id, member.name) for member in Member.query.all()]