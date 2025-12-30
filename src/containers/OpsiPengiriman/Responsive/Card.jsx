const Card = ({ children }) => {
    return (
        <div className={`p-4 bg-neutral-50 flex flex-col gap-y-4`}>
            {children}
        </div>
    )
}

export default Card