import mysql.connector

# Connect to MySQL database
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="tuan462002",
    database="ecomv2"
)

cursor = conn.cursor()

for i in range(10):
    name = f"category{i}"
    
    # Insert data into Categories table
    sql = "INSERT INTO Categories (category_id, name) VALUES (%s, %s)"
    val = (i+1, name)
    cursor.execute(sql, val)

    # Commit the transaction
    conn.commit()

# Generate and insert 10 records for TypeOfUser
for i in range(10):
    name = f"type_of_user{i}"
    
    # Insert data into TypeOfUser table
    sql = "INSERT INTO TypeOfUser (id, name) VALUES (%s, %s)"
    val = (i+1, name)
    cursor.execute(sql, val)

    # Commit the transaction
    conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

print("Records inserted successfully.")