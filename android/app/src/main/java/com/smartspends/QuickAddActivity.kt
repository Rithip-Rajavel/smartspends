package com.smartspends

import android.app.Activity
import android.content.Context
import android.os.Bundle
import android.view.Window
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class QuickAddActivity : Activity() {
    private lateinit var btnSave: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestWindowFeature(Window.FEATURE_NO_TITLE)
        setContentView(R.layout.activity_quick_add)

        val amountInput = findViewById<EditText>(R.id.quick_add_amount)
        val descriptionInput = findViewById<EditText>(R.id.quick_add_description)
        btnSave = findViewById<Button>(R.id.btn_save)
        val btnCancel = findViewById<Button>(R.id.btn_cancel)

        btnCancel.setOnClickListener {
            finish()
        }

        btnSave.setOnClickListener {
            val amountStr = amountInput.text.toString()
            val description = descriptionInput.text.toString()

            if (amountStr.isEmpty()) {
                Toast.makeText(this, "Please enter an amount", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val amount = amountStr.toDoubleOrNull()
            if (amount == null || amount <= 0) {
                Toast.makeText(this, "Valid amount required", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            saveExpense(amount, description)
        }
    }

    private fun saveExpense(amount: Double, description: String) {
        val prefs = getSharedPreferences("WidgetPrefs", Context.MODE_PRIVATE)
        val token = prefs.getString("authToken", null)

        if (token == null) {
            Toast.makeText(this, "Please log in via the app first", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        btnSave.isEnabled = false
        btnSave.text = "Saving..."

        thread {
            try {
                val url = URL("https://app.undefineddevelopers.online/smartspends/api/expenses")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Authorization", "Bearer $token")
                conn.doOutput = true

                val jsonObject = JSONObject()
                jsonObject.put("amount", amount)
                jsonObject.put("category", "MISCELLANEOUS")
                jsonObject.put("paymentMode", "UPI")
                jsonObject.put("description", if (description.isEmpty()) "Quick Added" else description)

                val os = OutputStreamWriter(conn.outputStream)
                os.write(jsonObject.toString())
                os.flush()
                os.close()

                val responseCode = conn.responseCode
                runOnUiThread {
                    if (responseCode in 200..299) {
                        Toast.makeText(this, "Expense added successfully!", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        Toast.makeText(this, "Failed to add expense. Status: $responseCode", Toast.LENGTH_LONG).show()
                        btnSave.isEnabled = true
                        btnSave.text = "Save"
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
                runOnUiThread {
                    Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                    btnSave.isEnabled = true
                    btnSave.text = "Save"
                }
            }
        }
    }
}
