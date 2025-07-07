import IntroPixi from "./components/globals/IntroPixi/IntroPixi";

import { Wrapper } from "./components/globals/Wrapper/Wrapper";
import Menu from "./components/globals/Menu/Menu";
import Progress from "./components/globals/Progress/Progress";
import SmoothWrapper from "./components/globals/SmoothWrapper/SmoothWrapper";
import SectionsController from "./components/globals/SectionsController/SectionsController";

export default function Home() {
  return (
    <>
      <Wrapper>
        <Progress />
        <IntroPixi />

        <SmoothWrapper>
          <SectionsController />
        </SmoothWrapper>

        <Menu
          data={[
            { title: "UB7", id: "intro" },
            { title: "Portfolio", id: "portfolio" },
            { title: "About", id: "about" },
            { title: "Contact", id: "contact" },
          ]}
        />
      </Wrapper>
    </>
  );
}
