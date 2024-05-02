export const Message = ({
  body,
  author,
  userName,
}: {
  body: string;
  author: string;
  userName: string;
}) => {
  return (
    <div className={`mb-2 ${author === userName && "text-right"}`}>
      <p
        className={` ${
          author === userName
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 "
        }  rounded-lg py-2 px-4 inline-block`}
      >
        {body}
      </p>
    </div>
  );
};
