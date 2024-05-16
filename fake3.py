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

# Generate and insert approximately 200 records for Medicine
for i in range(200):
    name =  f"ProductName{i}"
    description = f"Description{i}"
    quantity = random.randint(400, 3000)
    category_id = random.randint(1, 10)
    img = f"img/anh{random.randint(1,21)}.JPG"
    
    # Generate import_price and buy_price divisible by 1000
    base_price = random.randint(100, 600) * 1000  # Random integer between 100,000 and 600,000
    import_price = int(base_price / 1000.0)
    buy_price = (import_price  + random.randint(20, 100)) * 1000.0  # Add random amount, ensuring divisibility by 1000

    type_of_user_id = random.randint(1, 10)

    # Insert data into Medicine table
    sql = "INSERT INTO Medicine (med_id, name, description, quantity, category_id, img, import_price, buy_price, type_of_user_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    val = (i+1, name, description, quantity, category_id, img, base_price, buy_price, type_of_user_id)
    cursor.execute(sql, val)

    # Commit the transaction
    conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

print("Records inserted successfully.")
