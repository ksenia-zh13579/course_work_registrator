import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Main.module.scss';

export default function Main() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  const userName = user?.firstName || user?.login || user?.username;
  const getWelcomeText = () => {
    if (!isAuthenticated) {
      return (
        <>
          <strong>Добро пожаловать в приложение для регистрации и просмотра происшествий, в том числе преступлений, ДТП и несчастных случаев, - "Регистратор"©!</strong> 
          {' '}Чтобы просмотреть список зарегистрированных происшествий, перейдите в раздел{' '}
          <Link to="/incidents" className="text-link text-link--inline">Происшествия</Link>
          {'. Чтобы просмотреть список статусов участников происшествий ('}
          <em>подозреваемые, свидетели, потерпевшие, виновники</em>
          {'), перейдите в раздел '}
          <Link to="/involvements" className="text-link text-link--inline">Статусы</Link>
          {'. Чтобы отправить заявку на регистрацию нового происшествия, '}
          <Link to="/signin" className="text-link text-link--inline">войдите</Link>
          {' или '}
          <Link to="/register" className="text-link text-link--inline">зарегистрируйтесь</Link>
          {'.'}
        </>
      );
    }

    if (isAdmin) {
      return (
        <>
          <strong>
            <span style={{ color: '#910407' }}>{{ userName }}</span>, добро пожаловать в приложение для регистрации и просмотра происшествий, в том числе преступлений, ДТП и несчастных случаев, - "Регистратор"©!
          </strong>{' '}
          Чтобы просмотреть список зарегистрированных происшествий, а также добавить, редактировать или удалить конкретное происшествие, перейдите в раздел{' '}
          <Link to="/incidents" className="text-link text-link--inline">Происшествия</Link>
          {'. Чтобы просмотреть список статусов участников происшествий ('}
          <em>подозреваемые, свидетели, потерпевшие, виновники</em>
          {'), добавить, изменить или удалить статус участника, перейдите в раздел '}
          <Link to="/involvements" className="text-link text-link--inline">Статусы</Link>
          {'. Чтобы просмотреть, редактировать или удалить информацию о каждом из участников происшествий, перейдите в раздел '}
          <Link to="/participants" className="text-link text-link--inline">Участники</Link>
          {'.'}
        </>
      );
    }

    return (
      <>
        <strong>
          {userName}, добро пожаловать в приложение для регистрации и просмотра происшествий, в том числе преступлений, ДТП и несчастных случаев, - "Регистратор"©!
        </strong>{' '}
        Чтобы просмотреть список зарегистрированных происшествий, а также отправить заявку на регистрацию нового происшествия, перейдите в раздел{' '}
        <Link to="/incidents" className="text-link text-link--inline">Происшествия</Link>
        {'. Чтобы просмотреть список статусов участников происшествий ('}
        <em>подозреваемые, свидетели, потерпевшие, виновники</em>
        {'), перейдите в раздел '}
        <Link to="/involvements" className="text-link text-link--inline">Статусы</Link>
        {'.'}
      </>
    );
  };

  return (
    <div className="page-container page-container--centered">
      <p className={styles.welcomeText}>
        {getWelcomeText()}
      </p>
    </div>
  );
}
