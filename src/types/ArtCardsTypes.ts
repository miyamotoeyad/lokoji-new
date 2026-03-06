export type Articles = {
  articles: {
    fields: {
      title: string;
      subtitle: string
      category: string;
      slug: string;
      image: {
        fields: {
          file: {
            url: string;
          };
        };
      };
      author: {
        fields: {
            name: string;
        }
      }

      tag: Array<string>
    };
    sys: {
      id: string;
      createdAt: string;
      updatedAt: string;
    };
  };
};
