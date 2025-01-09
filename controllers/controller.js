const { Items, Categories, ItemCategories } = require("../models")

class Controller {
    // * route / untuk menampilkan halaman home
    static async goToHome(req, res) {
        try {
            res.redirect("/home")
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian untuk menampilkan homepage
    static async home(req, res) {
        try {
            res.render("homepage")
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian nampilin semua items yang dijual
    static async getAllCategory(req, res) {
        try {
            const stores = await Categories.findAll()
            res.render("all-categories", { stores })
        } catch (error) {
            res.send(error)
        }
    }
    static async getCategoryById(req, res) {
        try {
            const id = req.params.id
            const stores = await Items.findAll({
                include: [
                    {
                        model: ItemCategories,
                        include: {
                            model: Categories,
                            where: {
                                id: id
                            }
                        }
                    }
                ]
            })
            res.render("detail-categories", { stores })
        } catch (error) {
            res.send(error)
        }
    }
    static async getAllItems(req, res) {
        try {
            const stores = await Items.findAll()
            res.render("all-items", { stores })
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian nampilin details item
    static async itemDetails(req, res) {
        try {
            // const stores = await Items.findAll()
            const stores = await Items.findAll({
                include: [
                    {
                        model: ItemCategories,
                        include: {
                            model: Categories,
                        }
                    },
                ]
            })
            res.render("detail-items", { stores })
        } catch (error) {
            res.send(error)
            console.log(error);
        }
    }
    // * Bagian tampilkan form untuk tambah item baru
    static async addItemForm(req, res) {
        try {
            res.render("add-item")
        } catch (error) {
            res.send(error)
        }
    }
    // * untuk menambahkan item baru
    static async addNewItem(req, res) {
        try {
            const { name, stock, imageURL, description, condition, price, userId } = req.body
            await Items.create({
                name,
                stock,
                imageURL,
                description,
                condition,
                price,
                userId // ! kemungkinan perlu diubah ? itemId / userId?
            })
            res.redirect("/itemsforsale")
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian menampilkan form item untuk di edit berdasarkan id
    static async editItemForm(req, res) {
        try {
            const { itemId } = req.params
            const item = await Items.findByPk(itemId)
            res.render("edit-item", { item })
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian mengupdate item yang sudah di edit berdasarkan id
    static async editItem(req, res) {
        try {
            const { itemId } = req.params
            const { name, stock, imageURL, description, condition, price, userId } = req.body
            await Items.update({
                name,
                stock,
                imageURL,
                description,
                condition,
                price,
                userId // ! kemungkinan perlu diubah ? itemId / userId?
            }, {
                where: {
                    id: itemId
                }
            })
            res.redirect(`/itemsforsale`)
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian tampilkan semua profiles (nama saja yang terdaftar)
    static async getProfiles(req, res) {
        try {
            // const stores = await Profile.findAll()
            res.render("all-profiles", { stores })
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian tampilkan detail profile user berdasarkan id
    static async getProfilesById(req, res) {
        try {
            const { storeId } = req.params
            const store = await Store.findByPk(storeId, {
                include: {
                    model: Employee,
                    as: 'employees'
                }
            })
            const { formatToRupiah } = require("../helpers/formatter")
            res.render("details-profile", { store, formatToRupiah, message: req.query.message })
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian Tampilkan form untuk menambahkan profile/user baru
    static async addProfileForm(req, res) {
        try {
            const { errors } = req.query
            const { storeId } = req.params
            const store = await Store.findByPk(storeId)
            res.render("add-profile", { store, errors })
        } catch (error) {
            res.send(error.message)
        }
    }
    // * Bagian menambahkan data profile baru
    static async addNewProfile(req, res) {
        try {
            const { storeId } = req.params
            const { firstName, lastName, dateOfBirth, education, position, salary } = req.body
            // ? Perlu nambahin createdAt dan updatedAt tidak ya? karena di dbeaver ada columnnya
            // ! Jawaban: Tidak perlu, sudah otomatis
            await Employee.create({
                firstName,
                lastName,
                dateOfBirth,
                education,
                position,
                storeId,
                salary

            })
            res.redirect(`/profiles`)
        } catch (error) {
            // * Untuk menampilkan error validasi
            if (error.name === "SequelizeValidationError") {
                // di mapping ulang
                const errors = error.errors.map(el => el.message)
                res.redirect(`/stores/${req.params.storeId}/employees/add?errors=` + errors.join(';'))
            } else {
                res.send(error.message)
            }
            // res.send(error)
        }
    }
    // * Bagian menampilkan form Profile untuk di edit berdasarkan id
    static async editProfileForm(req, res) {
        try {
            const { storeId, employeeId } = req.params
            const store = await Store.findByPk(storeId)
            const employee = await Employee.findByPk(employeeId)
            res.render("edit-profile", { store, employee })
        } catch (error) {
            res.send(error)
        }
    }

    // * Bagian mengupdate Profile yang sudah di edit berdasarkan id
    static async editProfile(req, res) {
        try {
            const { storeId, employeeId } = req.params
            const { firstName, lastName, dateOfBirth, education, position, salary } = req.body
            await Employee.update({
                firstName,
                lastName,
                dateOfBirth,
                education,
                position,
                salary
            }, {
                where: {
                    id: employeeId
                }
            })
            res.redirect(`/stores/${storeId}`)
        } catch (error) {
            res.send(error)
        }
    }
    // * Bagian menghapus profile berdasarkan id
    static async deleteProfileById(req, res) {
        try {
            // ! Disuruh pakai metode promise chaining, jadinya harus pakai then, di tugas sebelumnya kita pakai async await 
            const { storeId, employeeId } = req.params

            // * ini metode promise chainingnya
            Employee.findByPk(employeeId)
                .then(employee => {
                    const message = `${employee.firstName} ${employee.lastName} removed`
                    return Employee.destroy({
                        where: {
                            id: employeeId
                        }
                    })
                        .then(() => {
                            res.redirect(`/profile/${storeId}?message=${message}`)
                        })
                })
        } catch (error) {
            res.send(error)
        }
    }

    // * Bagian menghapus store berdasarkan id
    static async deleteItemById(req, res) {
        try {
            const { itemId } = req.params
            await Items.destroy({
                where: {
                    id: itemId
                }
            })
            res.redirect("/itemsforsale")
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = Controller