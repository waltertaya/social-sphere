from flask_bcrypt import generate_password_hash, check_password_hash
from pyotp import TOTP
import os
import base64


def hashing_password(password):
    hashed_pswd = generate_password_hash(password, 14)

    return hashed_pswd

def compare_password(hashed_pwd, password):
    matched = check_password_hash(hashed_pwd, password)

    return matched

def generate_otp():
    totp = TOTP(base64.b32encode(os.urandom(10)).decode('utf-8'))
    otp = totp.now()

    return otp
