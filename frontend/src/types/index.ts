export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean;
  }

export interface Comment {
    _id: string;
    text: string;
    date: string;
    user: {
      name: string; 
      email: string;
    };
    news: { title: string };
  }
  
  export interface CommentsProps {
    newsId: string;
  }
  
  export interface News {
    _id: string;
    title: string;
    description: string;
    images: string[];
    category: {
      _id: string;
      name: string;
    };
    time: string;
    tags: string[];
    visibility: string;
    date: string;
    youtubeUrl: string;
    views: number;

  }
  
  export interface NewsListProps {
    newsList: News[];
    isLoading: boolean; 
    category?: boolean; // Add a prop to check if data is loading
  }
  export interface Category {
    _id: string;
    name: string;
    newsCount: number;
  }

  export interface LoaderProps {
    loading: boolean;
    color?: string;
    size?: number;
    center?: boolean; 
  }

  export interface SearchFiltersProps {
    setNewsList: React.Dispatch<React.SetStateAction<any[]>>;
  }

  export interface AdminRouteProps {
    children: React.ReactNode;
  }

 export interface IconsProps {
    size?: string; 
  }
  
 export interface Icons {
    [key: string]: (props: IconsProps) => React.ReactElement;
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
    category: {
      name: string;
    };
  }
  
  export interface UserProf {
    email: string;
    name: string;
    role: string;
    subscriptions: Subscription[];
    savedNews: SavedNews[];
  }