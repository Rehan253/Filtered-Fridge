from datetime import datetime
from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    phone_number = db.Column(db.String(20), nullable=False)

    address = db.Column(db.String(255), nullable=False)
    zip_code = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    role = db.Column(db.String(20), nullable=False, default="customer")
    status = db.Column(db.String(20), nullable=False, default="active")


    invoices = db.relationship(
        "Invoice",
        back_populates="user",
        lazy=True
    )


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(200), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text, nullable=True)
    unit = db.Column(db.String(50), nullable=True)

    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float, nullable=True)
    discount = db.Column(db.Float, nullable=True)
    quantity_in_stock = db.Column(db.Integer, nullable=False)

    picture_url = db.Column(db.String(255), nullable=True)
    icon = db.Column(db.String(20), nullable=True)
    nutritional_info = db.Column(db.Text, nullable=True)
    ingredients = db.Column(db.Text, nullable=True)
    dietary_tags = db.Column(db.Text, nullable=True)

    rating = db.Column(db.Float, nullable=True)
    reviews = db.Column(db.Integer, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    invoice_items = db.relationship(
        "InvoiceItem",
        back_populates="product",
        lazy=True,
        cascade="all, delete-orphan"
    )


class Invoice(db.Model):
    __tablename__ = "invoices"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    total_amount = db.Column(db.Float, nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    delivery_full_name = db.Column(db.String(200), nullable=True)
    delivery_email = db.Column(db.String(120), nullable=True)
    delivery_phone = db.Column(db.String(20), nullable=True)
    delivery_address = db.Column(db.String(255), nullable=True)
    delivery_apartment = db.Column(db.String(100), nullable=True)
    delivery_city = db.Column(db.String(100), nullable=True)
    delivery_state = db.Column(db.String(100), nullable=True)
    delivery_zip_code = db.Column(db.String(20), nullable=True)
    delivery_notes = db.Column(db.Text, nullable=True)
    payment_method = db.Column(db.String(50), nullable=True)

    user = db.relationship(
        "User",
        back_populates="invoices"
    )

    invoice_items = db.relationship(
        "InvoiceItem",
        back_populates="invoice",
        lazy=True,
        cascade="all, delete-orphan"
    )


class InvoiceItem(db.Model):
    """
    Invoice line items.
    Links products to invoices.
    """
    __tablename__ = "invoice_items"

    id = db.Column(db.Integer, primary_key=True)

    invoice_id = db.Column(
        db.Integer,
        db.ForeignKey("invoices.id"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("products.id"),
        nullable=False
    )

    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(10, 2), nullable=False)

    invoice = db.relationship(
        "Invoice",
        back_populates="invoice_items"
    )

    product = db.relationship(
        "Product",
        back_populates="invoice_items"
    )


class UserPreference(db.Model):
    __tablename__ = "user_preferences"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)

    halal_only = db.Column(db.Boolean, nullable=False, default=False)
    vegetarian = db.Column(db.Boolean, nullable=False, default=False)
    vegan = db.Column(db.Boolean, nullable=False, default=False)
    kosher = db.Column(db.Boolean, nullable=False, default=False)

    allergies = db.Column(db.Text, nullable=True)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("preferences", uselist=False))


class Promotion(db.Model):
    __tablename__ = "promotions"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)

    discount_type = db.Column(db.String(20), nullable=False)
    discount_value = db.Column(db.Float, nullable=False, default=0.0)
    min_purchase = db.Column(db.Float, nullable=False, default=0.0)

    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)

    categories = db.Column(db.Text, nullable=False)

    status = db.Column(db.String(20), nullable=False, default="active")
    promo_code = db.Column(db.String(50), nullable=True)

    image_url = db.Column(db.String(255), nullable=True)
    icon = db.Column(db.String(20), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
