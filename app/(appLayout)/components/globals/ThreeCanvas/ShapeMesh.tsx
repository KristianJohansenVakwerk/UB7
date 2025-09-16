"use client";

import SVGShape from "./SVGShape";

type Props = {
  clicked: boolean;
};

const MeshShape = (props: Props) => {
  return (
    <group position={[-0.5, 0.2, 0.1]}>
      <SVGShape />
    </group>
  );
};

export default MeshShape;
