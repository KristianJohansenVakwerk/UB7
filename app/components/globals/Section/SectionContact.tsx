import Box from "../../ui/Box/Box";
import SplitText from "../../shared/SplitText/SplitText";
import { useRef } from "react";
import { useContactAnimations } from "@/app/hooks/ContactAnimations";
type Props = {
  entry: any;
  active: boolean;
};

const info = [
  {
    title: "Social",
    items: [
      {
        label: "Linkedin",
        url: "https://www.linkedin.com/in/thiagosilva",
      },
      {
        label: "Instagram",
        url: "https://www.instagram.com/thiagosilva",
      },
      {},
    ],
  },
  {
    title: "E-mail",
    items: [
      {
        label: "info@ub7.com",
        url: "mailto:info@ub7.com",
      },
    ],
  },
  {
    title: "Address",
    items: [
      {
        label: (
          <p>
            Carrer de la Llum, 24, 3º 2ª <br /> 08002 Madrid <br /> España
          </p>
        ),
      },
    ],
  },
];
const text = `Contact ullamco laboris nisi ut \n ad minim veniam, quis nostrud \n exercitation et al.`;
const SectionContact = (props: Props) => {
  const { entry, active } = props;
  const container = useRef<HTMLDivElement>(null);
  useContactAnimations(entry, text, container, active);
  return (
    <Box
      ref={container}
      className="section section-animation-contact w-full h-full flex flex-col gap-10 items-start justify-start px-3 py-7"
    >
      <Box>
        <SplitText text={text} className={"text-7xl"} />
      </Box>

      <Box className="grid grid-cols-16 w-full">
        {info.map((item, index) => {
          return (
            <Box
              key={index}
              className={"col-span-3 info-item flex flex-col  opacity-0"}
            >
              <Box className="font-mono text-sm text-light-grey">
                {item.title}
              </Box>

              <Box className="flex flex-col gap-0">
                {item.items.map((link, index) => {
                  return (
                    <Box
                      key={index}
                      className="cursor-pointer text-base text-light-grey"
                    >
                      {link.label}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default SectionContact;
