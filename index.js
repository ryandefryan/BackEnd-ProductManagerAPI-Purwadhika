// Initialize All Packages
const mysql = require('mysql')
const express = require('express')
const app = express()
const cors = require('cors')

// Create MySQL Connection
const db = mysql.createConnection({
    user : 'root',
    password : '20121995',
    database : 'footballstoreid',
    port : 3306
})

// Initialize Body Parser ---> Untuk Menerima Request.Body dari Front-End
app.use(express.json())

// Initialize Cors
app.use(cors())

// Initialize PORT
const PORT = 4000

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome To FootballStoreId API')
})




// ############### Create-Read-Update-Delete (CRUD) ###############

// C R E A T E
app.post('/product', (req, res) => { // Req ---> Dari Front-End ke Back-End, Res ---> Dari Back-End ke Front-End
    // Step1. Terima Data dari Front-End
    const data = req.body

    // Step2. Data dari Front-End Sampai di Back-End
    console.log(data)
    // Step3. Setelah Data Diterima Back-End, Selanjutnya Data dikirim ke MySql
    
    // Query Lama
    // var sqlQuery = `INSERT INTO products (id_category, name, brand, price, discount, stock, sold, image1, image2, image3, status) 
    //                 VALUES ("${data.id_category}", "${data.name}", "${data.brand}", "${data.price}", "${data.discount}", "${data.stock}", "${data.sold}", "${data.image1}", "${data.image2}", "${data.image3}", "${data.status}");`
    
    //                 db.query(sqlQuery, (err, result) => {
    //     try{
    //         if(err) throw err
    //         res.send('( ! ) Data Added')
    //     } catch(error){
    //         res.send(error.message)
    //     }
    // })

    // Query Baru
    var sqlNewQuery = 'INSERT INTO products SET ?'


    db.query(sqlNewQuery, data, (err, result) => { // Req ---> Dari Front-End ke Back-End, Res ---> Dari Back-End ke Front-End
        try{
            if(err) throw err
            res.send('( ! ) Data Added')
        } catch(error){
            res.send(error.message)
        }
    })
})

// R E A D
app.get('/products', (req,res) => {
    var sqlQuery = 'SELECT * FROM products;'
    db.query(sqlQuery, (err,result) => {
        try {
            if(err) throw err
            res.send(result)
        } catch (error) {
            res.send(error.message)
        }
    })
})

app.get('/product/:idProduct' , (req,res) => { // Req ---> Dari Front-End ke Back-End, Res ---> Dari Back-End ke Front-End
    var id = req.params.idProduct
    var sqlQuery = 'SELECT * FROM products WHERE id = ?'
    db.query(sqlQuery, id, (err,result) => {
        try {
            if(result.length > 0){
                res.send(result)
            }else{
                res.send('( ! ) Data With Id : ' + id + ' Has Not Found')
            }
        } catch (error) {
            res.send(error.message)
        }
    }) 
})


app.get('/search', (req,res) => {
    var name = req.query.name
    console.log(name)

    var sqlQuery = `SELECT * FROM products WHERE name LIKE "%${name}%";`
    db.query(sqlQuery, (err,result) => { // Req ---> Dari Front-End ke Back-End, Res ---> Dari Back-End ke Front-End
        try {
            if(err) throw err
            if(result.length > 0){
                res.send(result)
            }else{
                res.send('( ! ) Data Not Fount')
            }
        } catch (error) {
            res.send(error.message)
        }
        
    })
})

// U P D A T E
// Step1. Cari Terlebih Dahulu Id dari Data yang Akan Diupdate (Get Data By Id)
// Step2. Apabila Data Ada, Maka Selanjutnya Data yang Diupdate dikirim ke MySql (Patch By Id)
// Step3. Apabila Data Tidak Ada, Maka Tampilkan Error "Data Not Found"

app.patch('/product/:idProduct', (req, res) => { // Req ---> Dari Front-End ke Back-End, Res ---> Dari Back-End ke Front-End
    const id = req.params.idProduct
    const data = req.body
    console.log(data)
    console.log(id)

    // Step1.
    var sqlQuery = 'SELECT * FROM products WHERE id = ?';

    db.query(sqlQuery, id, (err, result) => { 
        try {
            if(err) throw err
            
            // Step.2
            if(result.length > 0){
                var sqlQueryUpdate = 'UPDATE products SET ? WHERE id = ?';

                db.query(sqlQueryUpdate, [data, id], (err, result) => {
                    try {
                        if(err) throw err
                        res.send('( ! ) Data Edited Successfull')
                    } catch (error) {
                        res.send(error.message)
                    }
                })
            // Step3.
            }else{
                res.send('( ! ) Data With Id ' + id + ' Has Not Found')
            }
        } catch (error) {
            res.send(err.message)
        }
    })
})

// D E L E T E
// Step1. Cari Terlebih Dahulu Id dari Data yang Akan Didelete (Get Data By Id)
// Step2. Apabila Data Ada, Maka Selanjutnya Data yang Didelete dikirim ke MySql (Delete By Id)
// Step3. Apabila Data Tidak Ada, Maka Tampilkan Error "Data Not Found"

app.delete('/product/:idProduct', (req, res) => {
    const id = Number(req.params.idProduct)

    db.query('SELECT * FROM products WHERE id = ?;', id, (err, result) => {
        try {
            if (err) throw err

            if(result.length > 0){
                const sqlQuery = 'DELETE FROM products WHERE id = ?;'

                db.query(sqlQuery, id, (err, result) => {
                    try {
                        if (err) throw err
                        res.send('( ! ) Data Deleted Successfull')
                    } catch (error) {
                        res.send(error.message)
                    }
                })
            }else{
                res.send('( ! ) Data With Id ' + id + ' Has Not Found')
            }
        } catch (error) {
            res.send(error.message)
        }
    })
})

app.listen(PORT, () => console.log('API RUNNING ON PORT ' + PORT))