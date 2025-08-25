import Box from "../../ui/Box/Box";

type Props = { data: any };
const Accordion = (props: Props) => {
  const { data } = props;
  return (
    <Box className="flex flex-col lg:flex-row gap-0 w-full ">
      {data.map((item: any, index: number) => {
        return (
          <Box
            key={index}
            className={
              "accordion-item flex-1 flex flex-row items-center justify-between rounded-2xl bg-white min-h-[50px] px-2"
            }
          >
            {item.title}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="currentColor"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
        );
      })}
    </Box>
  );
};

export default Accordion;
