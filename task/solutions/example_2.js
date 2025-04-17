const ADD_BOOK = "ADD_BOOK";
const DELETE_BOOK = "DELETE_BOOK";
const SELL_BOOK = "SELL_BOOK";

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
        default:
            return state;
    }
};


// --- Redux: Create Store ---
const store = legacy_createStore(reducer, applyMiddleware(thunk));

const TableComponent = ({ book }) => {
    const dispatch = useDispatch();
    return (
        <tr>
            <td>{book.id}</td>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.price}</td>
            <td>{book.stock}</td>
            <td>
                <button onClick={() => dispatch(sellBookAction(book.id))} disabled={book.stock <= 0}>Sell</button>
                <button onClick={() => dispatch(deleteBookAction(book.id))}>Delete</button>
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