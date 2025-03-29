import { useState } from "react";

type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    stock: number;
};

function App() {
    const [bookStore, setBookStore] = useState<Book[]>([]);
    const [formData, setFormData] = useState<Omit<Book, "id">>({
        title: '',
        author: '',
        price: 0,
        stock: 0,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formData.stock < 0 || formData.price < 0) {
            return
        }
        const newBook: Book = {
            id: Date.now(),
            ...formData,
        };
        setBookStore((prev) => [...prev, newBook]);
        setFormData({ title: '', author: '', price: 0, stock: 0 });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? Number(value) : value,
        }));
    };

    const sellBook = (id: number) => {
        setBookStore((prev) =>
            prev.map((book) =>
                book.id === id && book.stock > 0
                    ? { ...book, stock: book.stock - 1 }
                    : book
            )
        );
    };

    const deleteBook = (id: number) => {
        setBookStore((prev) => prev.filter((book) => book.id !== id));
    };

    return (
        <>
            <h1 className="store-name">New Book Store</h1>
            <FormComponent
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                formData={formData}
            />
            <TableComponent
                bookStore={bookStore}
                sellBook={sellBook}
                deleteBook={deleteBook}
            />

        </>
    );
}

export default App;
function FormComponent({ handleSubmit, handleChange, formData }: any) {

    return <form onSubmit={handleSubmit}>
        <label htmlFor="new-book-title">Title</label>
        <input
            id="new-book-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
        />

        <label htmlFor="new-book-author">Author</label>
        <input
            id="new-book-author"
            name="author"
            value={formData.author}
            onChange={handleChange}
        />

        <label htmlFor="new-book-price">Price</label>
        <input
            id="new-book-price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
        />

        <label htmlFor="new-book-stock">Stock</label>
        <input
            id="new-book-stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
        />

        <button type="submit" id="add-book">Add Book</button>
    </form>

}

function TableComponent({ bookStore, sellBook, deleteBook }: any) {

    return <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Stock</th>
                <th colSpan={2}>Actions</th>
            </tr>
        </thead>
        <tbody>
            {bookStore.map((book, index) => (
                <tr key={book.id}>
                    <td>{index}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.price}</td>
                    <td>{book.stock}</td>
                    <td>
                        <button className="btn-sell" onClick={() => sellBook(book.id)}>
                            Sell
                        </button>
                    </td>
                    <td>
                        <button className="btn-delete" onClick={() => deleteBook(book.id)}>
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>

}