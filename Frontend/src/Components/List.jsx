const List = ({ listContent, isEncrypted }) => {
  return (
    <li className={isEncrypted && (listContent='')}>
      {listContent}
    </li>
  )
}

export default List