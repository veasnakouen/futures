package com.mtp.auth.models;

@Document("users")
data class Users {
    val email: String,
    val hashedPassword:String,
    @Id val id: ObjectId =ObjectId()
}
