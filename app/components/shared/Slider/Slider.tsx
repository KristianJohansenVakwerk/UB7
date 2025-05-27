import Box from "../../ui/Box/Box";

export interface TeamMember {
  name: string;
  text: string;
  image: string;
  socials: {
    platform: string;
    url: string;
  }[];
}

export const teamMembers: TeamMember[] = [
  {
    name: "Thiago Silva Pontes",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_1.jpg",
    socials: [
      { platform: "Website", url: "https://thiagosilva.com" },
      { platform: "Instagram", url: "https://instagram.com/thiagosilva" },
      { platform: "Youtube", url: "https://youtube.com/thiagosilva" },
    ],
  },
  {
    name: "Vinicius Junior",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_2.jpg",
    socials: [
      { platform: "Website", url: "https://viniciusjr.com" },
      { platform: "Instagram", url: "https://instagram.com/viniciusjr" },
      { platform: "Youtube", url: "https://youtube.com/viniciusjr" },
    ],
  },
  {
    name: "Vini Jr.",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    image: "/test-media/m_3.jpg",
    socials: [
      { platform: "Website", url: "https://vinijr.com" },
      { platform: "Instagram", url: "https://instagram.com/vinijr" },
      { platform: "Youtube", url: "https://youtube.com/vinijr" },
    ],
  },
];

const Slider = () => {
  return (
    <Box className="w-full h-full flex flex-row items-start justify-start gap-2 flex-nowrap cursor-grab">
      {teamMembers.map((m, index) => {
        return (
          <Box
            key={index}
            className="flex-1 bg-white rounded-2xl  h-full min-w-[768px] team-member-item opacity-0"
          >
            <Box className="px-3 py-2 flex flex-col gap-1">
              <Box className="text-light-grey text-base/none">{m.name}</Box>
              <Box className="flex flex-row items-stretch justify-start gap-2 h-full">
                <Box className="flex-1 h-full ">
                  <img
                    src={m.image}
                    width={"267"}
                    height={"312"}
                    className="w-auto h-full max-h-[312px]"
                  />
                </Box>
                <Box className="flex-2  text-light-grey flex flex-col justify-between">
                  <Box className="text-base">{m.text}</Box>
                  <Box className="flex flex-row items-center justify-start gap-1">
                    {m.socials.map((s, index) => {
                      return (
                        <Box
                          key={index}
                          className="font-mono text-sm text-light-grey bg-(--background) rounded-xl px-1 py-0.5"
                        >
                          {s.platform}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default Slider;
