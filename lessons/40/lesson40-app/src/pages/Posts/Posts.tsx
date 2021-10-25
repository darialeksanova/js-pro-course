import {useState, useEffect, useCallback, useContext} from 'react';
import PostsContainer from 'components/PostsContainer';
import Modal from 'components/Modal';
import Button from 'components/Button';
import AuthorInfo from 'components/AuthorInfo';
import { Author } from 'types/Author';
import { Post } from 'types/Post';
import styles from './Posts.module.css';
import classNames from 'classnames/bind';
import { ThemeContext } from 'ThemeContext';
import { Themes } from 'types/Theme';

type Props = {
  setIsDataLoaded: () => void;
};

const cx = classNames.bind(styles);

const Posts = ({ setIsDataLoaded }: Props) => {
  const [requestedAuthor, setRequestedAuthor] = useState<Author | null>(null);
  const [visiblePostsAmount, setVisiblePostsAmount] = useState(5);
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    Promise.all([
      fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then((response):Promise<Post[]> => response.json()),
      fetch(`https://jsonplaceholder.typicode.com/users`)
        .then((response):Promise<Author[]> => response.json()), 
    ])
    .then(([posts, authors]) => {
      setPosts(posts);
      setAuthors(authors);
      setIsDataLoaded();
    })
    .catch(_error => console.log('Sourse is not reachable!'));
  }, [setIsDataLoaded]);

  const openAuthorInfoModal = useCallback((requestedAuthorId: number): void => {
    const requestedAuthor = authors.find((author) => author.id === requestedAuthorId);
  
    if (requestedAuthor === undefined) {
      throw new Error('Author not found!');
    }
  
    setRequestedAuthor(requestedAuthor);
  },
  [authors]
  );

  return (
    <div className={cx({
      container: true,
      dark: theme === Themes.dark,
    })}>
      <h1 className={styles.title}>POSTS</h1>
      <PostsContainer 
        openAuthorInfoModal={(requestedUserId) => openAuthorInfoModal(requestedUserId)} 
        visiblePostsAmount={visiblePostsAmount}
        posts={posts}
        authors={authors}
      />
      {requestedAuthor && (
      <Modal 
        closeModal={() => setRequestedAuthor(null)}
        size='medium'
      > 
        <AuthorInfo authorData={requestedAuthor}></AuthorInfo>
      </Modal>
      )}
      <Button 
        onClick={() => setVisiblePostsAmount(prevState => prevState + 5)} 
        text='Show more'
        size='medium'
      />
    </div>
  );
}

export default Posts;