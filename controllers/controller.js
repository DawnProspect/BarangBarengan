const { Items, Categories, ItemCategories } = require("../models")
const { formatToRupiah } = require("../helpers/formatter")
const { Op } = require("sequelize")

class Controller {
    // * Fungsinya ngarahin ke homepage
    static async goToHome(req, res) {
        try {
            res.redirect("/home")
        } catch (error) {
            res.send(error)
        }
    }
    // * Halaman login/register page
    static async home(req, res) {
        try {
            res.render("homepage")
        } catch (error) {
            res.send(error)
        }
    }
    //* Halaman menunjukan semua kategori
    static async getAllCategory(req, res) {
        try {
            const stores = await Categories.findAll()
            res.render("all-categories", { stores })
        } catch (error) {
            res.send(error)
        }
    }
    //* tampilkan detail item berdasarkan kategori
    static async getCategoryById(req, res) {
        try {
            const id = req.params.id
            const stores = await Categories.findByPk(id, {
                include: [
                    {
                        model: ItemCategories,
                        include: {
                            model: Items
                        }
                    }
                ]
            })
            res.render("detail-categories", { stores, formatToRupiah })
        } catch (error) {
            res.send(error)
        }
    }
    // * Menunjukan form untuk menambahkan item
    static async addItembyCategoryPage(req, res) {
        try {
            const stores = await Categories.findAll()
            const id = req.params.id
            res.render("add-item", { stores, id })
        } catch (error) {
            res.send(error)
        }
    }
    // * Menambahkan item ke database
    static async addItembyCategoryData(req, res) {
        try {
            const id = req.params.id;
            const { name, stock, imageURL, description, condition, price } = req.body
            await Items.create({
                name,
                stock,
                imageURL,
                description,
                condition,
                price,
            })
            res.redirect(`/itemsforsale`)
        } catch (error) {
            // Versi lama
            // res.send(error)
            // console.log(error)
            // Buat nampilin error sequelize validation
            let errorMessage = error.message

            if (error.name === 'SequelizeValidationError') {
                errorMessage = error.errors[0].message
            }
            // Ini kirim error hooks ke ejs pada saat add item dimana harga barang harus lebih dari 10.000
            const stores = await Categories.findAll()
            res.render("add-item", {
                stores,
                id: req.params.id,
                error: error.message,
                formdata: req.body
            })
        }
    }
    // * Menunjukan form untuk memilih kategori tertentu untuk item yang sudah ada
    static async addItemtoCategoryPage(req, res) {
        try {
            const stores = await Categories.findAll()
            const id = req.params.id
            res.render("additembycategories", { stores, id });
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
    // * Menambahkan data kategori untuk item
    static async addItemtoCategoryData(req, res) {
        try {
            const id = req.params.id;
            const { category } = req.body
            await ItemCategories.create({
                CategoryId: category,
                ItemId: id
            })
            res.redirect(`/categories`)
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }

    // * Menunjukan semua item di database
    static async getAllItems(req, res) {
        try {
            const { search } = req.query;
            const id = req.params.id;
            let options = {};

            if (search) {
                options = {
                    where: {
                        name: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                }
            }

            const stores = await Items.findAll(options);
            res.render("all-items", { stores, id, formatToRupiah });
        } catch (error) {
            res.send(error);
        }
    }
    // * Mendapatkan item berdasarkan id
    static async getItemById(req, res) {
        try {
            const id = req.params.id
            const stores = await Items.findByPk(id)
            res.render("detail-items", { stores, formatToRupiah })
        } catch (error) {
            res.send(error)
        }
    }
    // * Menunjukan form untuk edit item
    static async editItemForm(req, res) {
        try {
            const id = req.params.id
            const stores = await Items.findByPk(id)
            res.render("edit-item", { stores })
        } catch (error) {
            res.send(error)
        }
    }
    // * Mengupdate item yang di edit
    static async editItemData(req, res) {
        try {
            const id = req.params.id
            const { name, stock, imageURL, description, condition, price } = req.body
            await Items.update({
                name,
                stock,
                imageURL,
                description,
                condition,
                price,
            }, {
                where: {
                    id
                }
            })
            res.redirect(`/itemsforsale`)
        } catch (error) {
            // res.send(error)
            const id = req.params.id
            let errorMessage = error.message

            if (error.name === 'SequelizeValidationError') {
                errorMessage = error.errors[0].message
            }
            // Ini kirim error hooks ke ejs pada saat add item dimana harga barang harus lebih dari 10.000
            const stores = await Items.findByPk(id)
            res.render("edit-item", {
                stores,
                error: errorMessage,
                formData: req.body
            })
        }
    }
    // * Menghapus item dan menggunakan 2x await
    static async deleteItem(req, res) {
        try {
            const id = req.params.id
            await ItemCategories.destroy({
                where: {
                    ItemId: id
                }
            })
            await Items.destroy({
                where: {
                    id
                }
            })
            res.redirect(`/itemsforsale`)
        } catch (error) {
            res.send(error)
        }
    }
    // static async deleteItem(req, res) {
    //     try {
    //         const id = req.params.id
    //         await Items.destroy({
    //             where: {
    //                 id
    //             }
    //         })
    //         res.redirect(`/itemsforsale`)
    //     } catch (error) {
    //         res.send(error)
    //     }
    // }
    // * Membeli item
    static async buyItem(req, res) {
        try {
            const id = req.params.id;
            const item = await Items.findByPk(id, {
                include: ItemCategories
            });
            
            if (item.stock > 0) {
                await Items.decrement('stock', {
                    where: { id }
                });
                // Redirect back to the category detail page
                res.redirect(`/categories/${item.ItemCategories[0].CategoryId}`);
            } else {
                res.redirect(`/categories/${item.ItemCategories[0].CategoryId}?error=outofstock`);
            }
        } catch (error) {
            res.send(error);
        }
    }
}

module.exports = Controller