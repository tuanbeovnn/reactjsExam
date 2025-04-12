// --- Redux: Reducer ---
const initialState = {
    items: [],
};
const reducer = (state = initialState, action) => {
    return state;
};




// --- Redux: Create Store ---
const store = legacy_createStore(reducer, applyMiddleware(thunk));

const TableComponent = ({ deleteBook, sellBook, book }) => {
    return (
        <tr>
            <td>{book.id}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.price}</td>
            <td>{book.stock}</td>
            <td>
                <button onClick={() => sellBook(book.id)} disabled={book.stock <= 0}>Sell</button>
                <button onClick={() => deleteBook(book.id)}>Delete</button>
            </td>
        </tr>
    )
}
const FormComponent = ({ newBookTitle, newBookAuthor, newBookPrice, newBookStock, setNewBookTitle, setNewBookAuthor, setNewBookStock, setNewBookPrice, addNewBook }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newBookTitle || !newBookAuthor || !newBookPrice || !newBookStock) { return }
        addNewBook({
            id: Date.now(),
            title: newBookTitle,
            author: newBookAuthor,
            stock: newBookStock,
            price: newBookPrice,
        });
        clearInputs();
    }

    const clearInputs = () => {
        setNewBookTitle("");
        setNewBookAuthor("");
        setNewBookPrice("");
        setNewBookStock("");
    }

    return (
        <form>
            <label htmlFor="title"> Title:
                <input
                    type="text"
                    placeholder="Enter book name"
                    name="title"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    required
                />
            </label>
            <label htmlFor="author"> Author:
                <input
                    type="text"
                    placeholder="Enter author name"
                    name="author"
                    value={newBookAuthor}
                    onChange={(e) => setNewBookAuthor(e.target.value)}
                    required
                />
            </label>
            <label htmlFor="price"> Price:
                <input
                    type="number"
                    placeholder="Enter Price"
                    name="price"
                    value={newBookPrice}
                    onChange={(e) => setNewBookPrice(e.target.value)}
                    required
                />
            </label>
            <label htmlFor="stock"> Stock:
                <input
                    type="number"
                    placeholder="Enter Stock"
                    name="stock"
                    value={newBookStock}
                    onChange={(e) => setNewBookStock(e.target.value)}
                    required
                />
            </label>
            <button type="submit" onClick={handleSubmit}>Add Book</button>
        </form>
    )

}


const App = () => {
    const [books, setBooks] = useState([]);
    const [newBookTitle, setNewBookTitle] = useState("");
    const [newBookAuthor, setNewBookAuthor] = useState("");
    const [newBookStock, setNewBookStock] = useState("");
    const [newBookPrice, setNewBookPrice] = useState("");

    const addNewBook = (book) => {
        setBooks(pre => [...pre, book]);
    }

    const deleteBook = (id) => {
        setBooks(pre => pre.filter(book => book.id !== id))
    }

    const sellBook = (id) => {
        setBooks(prev =>
            prev.map(book =>
                book.id === id
                    ? { ...book, stock: book.stock - 1 }
                    : book
            )
        );
    };


    console.log(books)

    return (
        <>
            <h1> Book store</h1>
            <FormComponent
                newBookTitle={newBookTitle}
                newBookAuthor={newBookAuthor}
                newBookPrice={newBookPrice}
                newBookStock={newBookStock}
                setNewBookTitle={setNewBookTitle}
                setNewBookAuthor={setNewBookAuthor}
                setNewBookPrice={setNewBookPrice}
                setNewBookStock={setNewBookStock}
                addNewBook={addNewBook}
            />
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Price</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <TableComponent
                            key={book.id}
                            book={book}
                            deleteBook={deleteBook}
                            sellBook={sellBook}
                        />
                    ))}
                </tbody>
            </table>
        </>
    )
};

// --- Render App ---
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);