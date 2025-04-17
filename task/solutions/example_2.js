const ADD_BOOK = "ADD_BOOK";
const DELETE_BOOK = "DELETE_BOOK";
const SELL_BOOK = "SELL_BOOK";
const EDIT_BOOK = "EDIT_BOOK";

const editBookAction = (updatedBook) => ({
    type: EDIT_BOOK,
    payload: updatedBook
});


const addBookAction = (book) => ({
    type: ADD_BOOK,
    payload: book
})

const deleteBookAction = (id) => ({
    type: DELETE_BOOK,
    payload: id
})

const sellBookAction = (id) => ({
    type: SELL_BOOK,
    payload: id
})

// --- Redux: Reducer ---
const initialState = {
    items: [],
};
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_BOOK:
            return { ...state, items: [...state.items, action.payload] };
        case SELL_BOOK:
            return {
                ...state,
                items: state.items.map((book) => book.id === action.payload ?
                    { ...book, stock: book.stock - 1 } :
                    book)
            }
        case DELETE_BOOK:
            return { ...state, items: state.items.filter((book) => book.id !== action.payload) }
        case EDIT_BOOK:
            return {
                ...state,
                items: state.items.map((book) =>
                    book.id === action.payload.id ? { ...book, ...action.payload } : book
                )
            };
        default:
            return state;
    }
};


// --- Redux: Create Store ---
const store = legacy_createStore(reducer, applyMiddleware(thunk));

const TableComponent = ({ book }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedBook, setEditedBook] = useState({ ...book });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedBook({ ...editedBook, [name]: value });
    };

    const handleSave = () => {
        dispatch(editBookAction({ ...editedBook, price: Number(editedBook.price), stock: Number(editedBook.stock) }));
        setIsEditing(false);
    };
    return (
        <tr>
            <td>{book.id}</td>
            <td>
                {isEditing ? (
                    <input name="title" value={editedBook.title} onChange={handleChange} />
                ) : (
                    book.title
                )}
            </td>
            <td>
                {isEditing ? (
                    <input name="author" value={editedBook.author} onChange={handleChange} />
                ) : (
                    book.author
                )}
            </td>
            <td>
                {isEditing ? (
                    <input name="price" type="number" value={editedBook.price} onChange={handleChange} />
                ) : (
                    book.price
                )}
            </td>
            <td>
                {isEditing ? (
                    <input name="stock" type="number" value={editedBook.stock} onChange={handleChange} />
                ) : (
                    book.stock
                )}
            </td>
            <td>
                {isEditing ? (
                    <>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => dispatch(sellBookAction(book.id))} disabled={book.stock <= 0}>Sell</button>
                        <button onClick={() => dispatch(deleteBookAction(book.id))}>Delete</button>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                    </>
                )}
            </td>
        </tr>
    )
}

const FormComponent = () => {
    const [newBookTitle, setNewBookTitle] = useState("")
    const [newBookAuthor, setNewBookAuthor] = useState("")
    const [newBookPrice, setNewBookPrice] = useState("")
    const [newBookStock, setNewBookStock] = useState("")

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newBookTitle || !newBookAuthor || !newBookPrice || !newBookStock) { return }

        const book = {
            id: Date.now(),
            title: newBookTitle,
            author: newBookAuthor,
            stock: newBookStock,
            price: newBookPrice,
        }
        dispatch(addBookAction(book));
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
                    id="new-book-title"
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
                    id="new-book-author"
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
                    id="new-book-price"
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
                    id="new-book-stock"
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
    const books = useSelector((state) => state.items)
    return (
        <>
            <h1> Book store</h1>
            <FormComponent />
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
root.render(
    <Provider store={store}>
        <App />
    </Provider>);