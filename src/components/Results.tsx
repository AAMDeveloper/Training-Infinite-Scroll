import { useUsers } from '../hooks/useUsers'

export const Results = () => {
    const { totalUsers, displayedUsers } = useUsers()

    return (
        <h3>
            Mostrando: {displayedUsers as number} / Total: {totalUsers as number}
        </h3>
    )
}