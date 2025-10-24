

# Jangbokk – Lightning-Powered Payment Platform

**Jangbokk** is a Lightning-enabled platform built on top of **LNbits** and **FastAPI** that allows users to manage wallets, process payments, and integrate Lightning capabilities into their own applications.

---

## ⚙️ Features

* 💰 Create and manage Lightning wallets
* ⚡ Send and receive Lightning payments
* 🔌 API integration for developers
* 🪙 Optional LNbits-based backend support
* 🧩 Modular architecture for easy extension

---

## 🧠 Requirements

Make sure you have the following installed on your system:

| Tool                                             | Description                                     |
| ------------------------------------------------ | ----------------------------------------------- |
| [Python 3.12](https://www.python.org/downloads/) | Backend runtime                                 |
| [Git](https://git-scm.com/downloads)             | Clone the repository                            |
| [Rust](https://www.rust-lang.org/tools/install)  | For compiling dependencies like `pydantic-core` |
| [Node.js](https://nodejs.org/en/download/)       | (Optional) For frontend builds                  |
| [MSYS2 (Windows only)](https://www.msys2.org/)   | Provides `pkg-config`, `make`, and other tools  |

---

## 🧩 Setup on Windows (Recommended Path)

### 1️⃣ Clone the project

```bash
git clone https://github.com/yourusername/jangbokk.git
cd jangbokk
```

### 2️⃣ Install Python 3.12 and create a virtual environment

```bash
py -3.12 -m venv venv
venv\Scripts\activate
```

### 3️⃣ Upgrade `pip`

```bash
python -m pip install --upgrade pip
```

### 4️⃣ Install MSYS2 build tools (if not already)

Open **MSYS2 MinGW 64-bit shell** and run:

```bash
pacman -Syu
pacman -S mingw-w64-x86_64-toolchain pkg-config make automake autoconf libtool
```

> ⚠️ If you’re prompted for selections, press **Enter** to install all.

### 5️⃣ Install dependencies

```bash
pip install fastapi uvicorn jinja2 requests sqlalchemy aiosqlite python-dotenv secp256k1
```

If `secp256k1` fails to build, ensure:

* Rust is installed (`rustc --version`)
* MSYS2 tools are on PATH
* Then retry the install command.

---

## 🚀 Running the Backend

Run the FastAPI backend with:

```bash
python -m uvicorn lnbits.__main__:app --host 127.0.0.1 --port 5000 --reload
```

Once running, open your browser at:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

You should see the backend API running.

---

## 🧰 Using the LNbits-Based Script (Alternative)

Jangbokk can also bootstrap using the LNbits script included in the repo:

```bash
bash lnbits.sh
```

This script will:

* Install `uv`
* Clone LNbits inside the project
* Create a `.venv` automatically
* Install dependencies
* Launch LNbits

If you see:

```
'pkg-config' is required to install this package.
```

then return to MSYS2 and make sure `pkg-config` is installed (see Step 4 above).

---

## 🧪 Testing the API

Test if the backend is working:

```bash
curl -i http://127.0.0.1:5000/
```

Expected response:

```
HTTP/1.1 200 OK
...
```



---

## 🧰 Troubleshooting

| Issue                        | Solution                                   |
| ---------------------------- | ------------------------------------------ |
| `pkg-config missing`         | Install via MSYS2: `pacman -S pkg-config`  |
| `pydantic-core build failed` | Use Python 3.12 (not 3.13)                 |
| `uvicorn not found`          | Run `pip install uvicorn` inside your venv |
| `secp256k1` install error    | Ensure Rust + build tools are on PATH      |

---

## 🌐 Deployment (Optional)

To run in production:

```bash
uvicorn lnbits.__main__:app --host 0.0.0.0 --port 8000
```

You can also use **Docker** or **NGINX reverse proxy** for HTTPS setup.

---

## 🧑‍💻 Contributing

Pull requests are welcome!
To contribute:

1. Fork the repo
2. Create a feature branch
3. Commit and push changes
4. Submit a pull request

-
