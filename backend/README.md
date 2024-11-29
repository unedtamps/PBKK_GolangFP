# PBKK Golang FP 

## How To Run

### 1. Clone this repository
```bash 
 git clone https://github.com/unedtamps/PBKK_GolangFP.git
```

### 2. Install the dependencies
```bash
go mod tidy
```

### 3. Copy the .env.example file
```bash
cp .env.example .env
```

### 4. Run the migration
```bash
go run main.go migrate
```

### 5. Run the seed
```bash
go run main.go seed
```

### 6. Install `air` for hot reload
```bash
go install github.com/cosmtrek/air@latest
```
### 7. Run the server
```bash
air
```
