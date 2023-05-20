import "./InputTags.css";


const InputTags = ({ tags, setTags }) => {


    const handleKeyDown = (e) => {

        const value = e.target.value;

        if (e.key !== "Enter") {
            return;
        };

        if (value === "") {
            e.preventDefault();
            return;
        }

        if (tags.length === 3) {
            return;
        }

        e.preventDefault();
        setTags([...tags, value]);

        e.target.value = '';
        return;

    }

    const removeTags = (index) => {
        setTags(tags.filter((tag, i) => i !== index));
    }

    return (
        <div>
            <div className="input-container">
                {tags.map((tag, index) => (
                    <div key={index} className="tag-item">
                        <span className="text">{tag}</span>
                        <span onClick={() => { removeTags(index) }} className="close">&times;</span>
                    </div>
                ))
                }
                <input onKeyDown={handleKeyDown} type="text" className="tags-input" placeholder="Enter 3 Tags..." />
            </div>
        </div>

    )
}

export default InputTags;