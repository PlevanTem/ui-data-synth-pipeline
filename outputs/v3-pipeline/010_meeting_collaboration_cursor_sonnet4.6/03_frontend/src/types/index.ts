export interface Meeting {
    id: string;
    title: string;
    time: string;
    status: 'upcoming' | 'ongoing' | 'past';
    participants: string[];
}

export interface Task {
    id: string;
    title: string;
    assignee: string;
    completed: boolean;
}
