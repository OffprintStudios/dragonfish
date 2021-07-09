export function calculateApprovalRating(likes: number, dislikes: number): number {
    const totalVotes = likes + dislikes;

    if (totalVotes === 0) {
        return 0;
    } else {
        return Math.ceil((likes / totalVotes) * 100);
    }
}
