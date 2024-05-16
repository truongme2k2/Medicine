import mysql.connector
from faker import Faker
import random
from datetime import datetime, timedelta

# Connect to MySQL database
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="tuan462002",
    database="ecom"
)

cursor = conn.cursor()

# Function to generate random date within a range
def random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    return start_date + timedelta(days=random_days)

# Generate fake data
fake = Faker()

# Generate and insert orders
order_id = 8  # Start order_id from 8
for _ in range(2000):  # Insert 2000 records
    order_id += 1
    order_date = random_date(datetime(2021, 1, 1), datetime(2023, 12, 31))
    user_id = random.randint(5, 13)
    total_price = 0  # Set total_price to 0
    status = 1  # Set status to 1
    # Insert data into app_orders table
    sql = "INSERT INTO app_orders (order_id, time, total_price, user_id, status) VALUES (%s, %s, %s, %s, %s)"
    val = (order_id, order_date, total_price, user_id, status)
    cursor.execute(sql, val)

# Commit the transaction
conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

print("Records inserted successfully.")
