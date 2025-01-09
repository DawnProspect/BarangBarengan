// format harga to rupiah
const formatToRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(number)
}

module.exports = { formatToRupiah }