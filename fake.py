import mysql.connector

from faker import Faker

import random

# Connect to MySQL database
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="tuan462002",
    database="ecomv2"
)
cursor = conn.cursor()
fake = Faker()
# Generate and insert 10,000 records
for i in range(10000):
    email = f"email{i}@gmail.com"
    address = f"address{random.randint(0, 200)}"
    phone = fake.phone_number()[:11] 
    status = 0
    is_active = 1
    is_staff = 0
    
    # Insert data into UserProfile table
    sql = "INSERT INTO UserProfile (id, email, is_active, is_staff, address, phone, status) VALUES (%s, %s, %s, %s, %s, %s, %s)"
    val = (i+1, email, is_active, is_staff, address, phone, status)
    cursor.execute(sql, val)

    # Commit the transaction
    conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

print("Records inserted successfully.")
