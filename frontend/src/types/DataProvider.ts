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
    comments: Comment[];
    fetchNewsDetails: () => void;
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
    comments: Comment[];

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

  export interface CategoryListProps {
    category: Category;
    onClick: () => void;
  }
  
  // Data for the footer categories
  export const footerData = [
    {
      title: 'Business',
      links: [
        { name: 'Startup', path: '/' },
        { name: 'Employee', path: '/' },
        { name: 'Success', path: '/' },
        { name: 'Videos', path: '/' },
        { name: 'Markets', path: '/' },
      ],
    },
    {
      title: 'Technology',
      links: [
        { name: 'Innovate', path: '/' },
        { name: 'Gadget', path: '/' },
        { name: 'Innovative Cities', path: '/' },
        { name: 'Upstarts', path: '/' },
        { name: 'Future Tech', path: '/' },
      ],
    },
    {
      title: 'Travel',
      links: [
        { name: 'Destinations', path: '/' },
        { name: 'Food & Drink', path: '/' },
        { name: 'Stay', path: '/' },
        { name: 'News', path: '/' },
        { name: 'Videos', path: '/' },
      ],
    },
    {
      title: 'Sports',
      links: [
        { name: 'Football', path: '/' },
        { name: 'Tennis', path: '/' },
        { name: 'Golf', path: '/' },
        { name: 'Motorsports', path: '/' },
        { name: 'Esports', path: '/' },
      ],
    },
  ];

 export interface NavbarButtonProps {
    path: string;
    label: string;
    activeCategory: string | null;
    onClick: () => void;
  }
  
 export interface ProfileIconProps {
    isAuthenticated: boolean;
    user: { name?: string } | null;
  }
  
export interface NewsCardProps { news: News, onClick: () => void }

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface errorFields{
  title: boolean;
  description: boolean;
  images: boolean;
  category: boolean;
}