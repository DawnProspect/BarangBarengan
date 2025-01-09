const { Items, Categories, ItemCategories } = require("../models")
const { formatToRupiah }= require("../helpers/formatter")

class Controller {
    // *Dipakai
    static async goToHome(req, res) {
        try {
            res.redirect("/home")
        } catch (error) {
            res.send(error)
        }
    }
    //* Dipakai
    static async home(req, res) {
        try {
            res.render("homepage")
        } catch (error) {
            res.send(error)
        }
    }
    //* Dipakai
    static async getAllCategory(req, res) {
        try {
            const stores = await Categories.findAll()
            res.render("all-categories", { stores })
        } catch (error) {
            res.send(error)
        }
    }
    static async getCategoryById(req, res) { //* Bagian nampilin detail category berdasarkan id
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
    // * Dipakai 
    static async addItembyCategoryPage(req, res) {
        try {
            const stores = await Categories.findAll()
            const id = req.params.id
            res.render("add-item", { stores , id})
        } catch (error) {
            res.send(error)
        }
    }
    // * Dipakai 
    static async addItembyCategoryData(req, res) {
        try {
            const id  = req.params.id;
            const { name, stock, imageURL, description, condition, price} = req.body
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
            res.send(error)
            console.log(error)
        }
    }
    // * Dipakai
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
    // * Dipakai
    static async addItemtoCategoryData(req, res){ 
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

    // * Dipakai
    static async getAllItems(req, res) { //* Bagian nampilin semua items yang dijual
        try {
            const { search } = req.query;
            let options = {};
            if (search) {
                options = {
                    where: {
                        name: {
                            [Op.iLike]: `%${search}%`
                        }
                    }
                }
                const stores = await Items.findAll(options)
                res.render("all-items", { stores })
            }
            const id = req.params.id
            const stores = await Items.findAll()
            res.render("all-items", { stores , id, formatToRupiah})
        } catch (error) {
            res.send(error)
        }
    }

    static async getItemById(req, res){
        try {
            const id = req.params.id
            const stores = await Items.findByPk(id)
            res.render("detail-items", { stores, formatToRupiah })
        } catch (error) {
            res.send(error)
        }
    }

    static async editItemForm(req, res){
        try {
            const id = req.params.id
            const stores = await Items.findByPk(id)
            res.render("edit-item", { stores })
        } catch (error) {
            res.send(error)
        }
    }
    static async editItemData(req, res){
        try {
            const id = req.params.id
            const { name, stock, imageURL, description, condition, price} = req.body
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
            res.send(error)
        }
    }
    
    static async deleteItem(req, res){
        try {
            const id = req.params.id
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
}

module.exports = Controller