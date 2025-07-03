# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import MySQLdb

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    return MySQLdb.connect(
        host='localhost',
        user='root',
        password='Yoyoqls_2005',
        db='hotelmanagement2'
    )

@app.route('/test', methods=['GET'])
def test_db_connection():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT NOW();")
        result = cursor.fetchone()
        connection.close()
        return jsonify({"message": "Connection successful!", "time": result[0]}), 200
    except MySQLdb.Error as e:
        return jsonify({"message": "Database connection failed", "error": str(e)}), 500

@app.route('/guests', methods=['GET'])
def get_guests():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""SELECT users.*, guests.Age 
                   FROM guests 
                   JOIN users ON guests.User_ID = users.User_ID 
                   WHERE users.Role='Guest';""")
    guests = cursor.fetchall()
    connection.close()

    guests_list = [
        {
            'id': guest[0],
            'name': guest[1],
            'email': guest[2],
            'address': guest[3],
            'phone': guest[4],
            'dob': guest[5],
            'role': guest[6],
            'age': guest[7]
        }
        for guest in guests
    ]
    return jsonify(guests_list)

@app.route('/employees', methods=['GET'])
def get_employees():
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""SELECT users.*, employees.Position, employees.Salary
                   FROM employees
                   JOIN users ON employees.User_ID = users.User_ID 
                   WHERE users.Role='Employee';""")
    employees = cursor.fetchall()
    connection.close()

    employees_list = [
        {
            'id': employee[0],
            'name': employee[1],
            'email': employee[2],
            'address': employee[3],
            'phone': employee[4],
            'dob': employee[5],
            'role': employee[6],
            'position': employee[7],
            'salary': employee[8]
        }
        for employee in employees
    ]
    return jsonify(employees_list)

@app.route('/create_user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        connection = get_db_connection()
        cursor = connection.cursor()

        role = data.get('role')

        cursor.execute("""
            INSERT INTO Users (Name, Email, Address, Phone, DOB, Role)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (data['name'], data['email'], data['address'], data['phone'], data['dob'], role))

        user_id = cursor.lastrowid

        if role == 'Employee':
            cursor.execute("SELECT MAX(E_ID) FROM Employees;")
            max_e_id = cursor.fetchone()[0] or 0
            e_id = max_e_id + 1

            cursor.execute("""
                INSERT INTO Employees (E_ID, User_ID, Position, Salary)
                VALUES (%s, %s, %s, %s)
            """, (e_id, user_id, data['position'], data['salary']))
        elif role == 'Guest':
            cursor.execute("SELECT MAX(G_ID) FROM Guests;")
            max_g_id = cursor.fetchone()[0] or 0
            g_id = max_g_id + 1

            cursor.execute("""
                INSERT INTO Guests (G_ID, Age, User_ID)
                VALUES (%s, %s, %s)
            """, (g_id, data['age'], user_id))

        connection.commit()
        connection.close()

        return jsonify({"message": "User created successfully", "user_id": user_id}), 201

    except MySQLdb.Error as e:
        return jsonify({"message": "Error creating user", "error": str(e)}), 500
    

@app.route('/delete_user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) FROM Employees WHERE User_ID = %s", (user_id,))
        is_employee = cursor.fetchone()[0] > 0

        cursor.execute("SELECT COUNT(*) FROM Guests WHERE User_ID = %s", (user_id,))
        is_guest = cursor.fetchone()[0] > 0

        if is_employee:
            cursor.execute("DELETE FROM Employees WHERE User_ID = %s", (user_id,))
        
        if is_guest:
            cursor.execute("DELETE FROM Guests WHERE User_ID = %s", (user_id,))
        
        cursor.execute("DELETE FROM Users WHERE User_ID = %s", (user_id,))
        
        connection.commit()
        connection.close()

        return jsonify({"message": f"User with User_ID {user_id} deleted successfully"}), 200

    except MySQLdb.Error as e:
        return jsonify({"message": "Error deleting user", "error": str(e)}), 500


@app.route('/update_user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.json  # Get JSON payload
        connection = get_db_connection()
        cursor = connection.cursor()

        # Update user data based on type (employee or guest)
        cursor.execute("SELECT COUNT(*) FROM Employees WHERE User_ID = %s", (user_id,))
        is_employee = cursor.fetchone()[0] > 0

        if is_employee:
            cursor.execute(
                "UPDATE Employees SET Name = %s, Position = %s, Salary = %s, Address = %s, Phone = %s WHERE User_ID = %s",
                (data["name"], data["position"], data["salary"], data["address"], data["phone"], user_id),
            )
        else:
            cursor.execute(
                "UPDATE Guests SET Name = %s, Age = %s, Address = %s, Phone = %s WHERE User_ID = %s",
                (data["name"], data["age"], data["address"], data["phone"], user_id),
            )

        connection.commit()
        connection.close()

        return jsonify({"message": f"User with ID {user_id} updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e), "message": "Error updating user"}), 500



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
