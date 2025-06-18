from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL connection
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="sandeep123",  # Change if needed
    database="portfolio"
)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/connect', methods=['GET', 'POST'])
def connect():
    try:
        linkedin = request.form.get('linkedin')
        instagram = request.form.get('instagram')
        email = request.form.get('email')

        if not (linkedin and instagram and email):
            return "All fields are required!", 400

        cursor = mydb.cursor()
        cursor.execute(
            "INSERT INTO connect (instagram, linkedin, email) VALUES (%s, %s, %s)",
            (instagram, linkedin, email)
        )
        mydb.commit()
        print("✅ Data inserted")
        cursor.close()

        return render_template("index.html")

    except Exception as e:
        return f"Error: {str(e)}", 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000,debug=True)
