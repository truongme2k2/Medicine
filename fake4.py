import mysql.connector
from faker import Faker
import random
from datetime import datetime, timedelta

# Connect to MySQL database
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="tuan462002",
    database="ecomv2"
)
cursor = conn.cursor()

# Function to generate random date within a range
def random_date(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    return start_date + timedelta(days=random_days)

# Generate fake data
fake = Faker()

# Query to fetch user IDs from UserProfile table
cursor.execute("SELECT id FROM UserProfile")
user_ids = [row[0] for row in cursor.fetchall()]

# Generate and insert orders for each user
i = 1
for user_id in user_ids:
    num_orders = random.randint(15, 20)
    for _ in range(num_orders):
        order_id = i
        i+=1  
        order_date = random_date(datetime(2021, 1, 1), datetime(2023, 12, 31)).date()
        total_price = 0  # Set total_price to 0
        status = 0  # Default status
        # Insert data into Orders table
        sql = "INSERT INTO Orders (order_id, time, user_id, total_price, status) VALUES (%s, %s, %s, %s, %s)"
        val = (order_id, order_date, user_id, total_price, status)
        cursor.execute(sql, val)

# Commit the transaction
conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

print("Records inserted successfully.")
