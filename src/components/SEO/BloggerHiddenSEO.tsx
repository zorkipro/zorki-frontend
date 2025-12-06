/**
 * Скрытый SEO-контент для страницы блогера
 * Виден поисковым системам, но скрыт от пользователей
 * Содержит все варианты имени, фамилии и никнейма для лучшей индексации
 */

interface BloggerHiddenSEOProps {
  name: string;
  firstName?: string;
  lastName?: string;
  allNames: string[];
  allUsernames: string[];
  platformName?: string;
  category?: string;
}

export const BloggerHiddenSEO = ({
  name,
  firstName,
  lastName,
  allNames,
  allUsernames,
  platformName,
  category,
}: BloggerHiddenSEOProps) => {
  // Создаем все возможные комбинации для поиска
  const searchVariants: string[] = [];
  
  // Варианты с именем
  allNames.forEach(nameVariant => {
    searchVariants.push(nameVariant);
    searchVariants.push(`${nameVariant} блогер`);
    searchVariants.push(`${nameVariant} инфлюенсер`);
    if (platformName) {
      searchVariants.push(`${nameVariant} ${platformName}`);
      searchVariants.push(`${nameVariant} ${platformName} блогер`);
    }
    if (category) {
      searchVariants.push(`${nameVariant} ${category}`);
    }
  });
  
  // Варианты с никнеймами
  allUsernames.forEach(username => {
    searchVariants.push(username);
    searchVariants.push(`@${username}`);
    searchVariants.push(`${username} блогер`);
    allNames.forEach(nameVariant => {
      searchVariants.push(`${nameVariant} ${username}`);
      searchVariants.push(`${nameVariant} @${username}`);
    });
  });
  
  // Комбинации имя + фамилия
  if (firstName && lastName) {
    searchVariants.push(`${firstName} ${lastName}`);
    searchVariants.push(`${lastName} ${firstName}`);
    searchVariants.push(`${firstName} ${lastName} блогер`);
    searchVariants.push(`${lastName} ${firstName} блогер`);
  }

  return (
    <div 
      className="sr-only"
      aria-hidden="true"
      style={{ 
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: 0
      }}
    >
      {/* Скрытый контент для поисковых систем - виден только роботам */}
      <h2>{name} - блогер Беларуси</h2>
      {firstName && <p>Имя: {firstName}</p>}
      {lastName && <p>Фамилия: {lastName}</p>}
      {firstName && lastName && (
        <>
          <p>Полное имя: {firstName} {lastName}</p>
          <p>Обратный порядок: {lastName} {firstName}</p>
        </>
      )}
      {allNames.length > 1 && (
        <p>Также известен как: {allNames.slice(1).join(", ")}</p>
      )}
      {allUsernames.length > 0 && (
        <p>Никнеймы: {allUsernames.map(u => `@${u}`).join(", ")}</p>
      )}
      {platformName && <p>{platformName} блогер</p>}
      {category && <p>Тематика: {category}</p>}
      
      {/* Все варианты поисковых запросов для индексации */}
      <div>
        {searchVariants.map((variant, index) => (
          <span key={index}>{variant} </span>
        ))}
      </div>
    </div>
  );
};
