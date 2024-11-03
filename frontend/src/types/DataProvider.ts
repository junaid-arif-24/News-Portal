export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
    subscriptions: Subscription[];
    savedNews: SavedNews[];
  }

export interface Comment {
    _id: string;
    text: string;
    date: string;
    user: User;
    news: { title: string };
  }
  
  export interface CommentsProps {
    newsId: string;
    comments: Comment[];
    fetchNewsDetails: () => void;
  }
  
  export interface News {
    _id: string;
    title: string;
    description: string;
    images: string[];
    category: Category;
    time: string;
    tags: string[];
    visibility: string;
    date: string;
    youtubeUrl: string;
    views: number;
    comments: Comment[];

  }

  export interface SavedNewsId {
   id: string;
  }
  
 
  export interface Category {
    _id: string;
    name: string;
    newsCount: number;
  }

 

  

 
  export interface Subscription {
    _id: string;
    name: string;
  }
  
  export interface SavedNews {
    _id: string;
    title: string;
    date: string;
    time: string;
    images: string[];
    category: Category;
  }
  
 
  
 



