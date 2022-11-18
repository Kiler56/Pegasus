import { Button } from "../components/Button";
import logo from "public/logo.svg";
import bgImg from "public/image3.png";

export default function Home() {
  return (
    <div
      className="m-auto flex h-screen w-screen flex-col bg-blend-soft-light items-center justify-center gap-5 bg-[#c4c4c4]"
	  style={{ backgroundImage: `url(${bgImg.src})` }}
    >
      <img src={logo.src} />
      <div className="flex w-[200px] flex-col gap-4 md:w-[400px]">
        <Button
          content="EAFIT"
          primary="#0F8B8D"
          secondary="#0E6566"
          extraStyle={{ padding: "20px 0 20px 0" }}
        />
        <Button
          content="Iniciar Sesión"
          primary="#750E6E"
          secondary="#43083F"
          extraStyle={{ padding: "20px 0 20px 0" }}
        />
      </div>

      <div className="flex flex-row gap-5">
		<p className="cursor-pointer hover:drop-shadow-lg hover:font-bold">¿Cómo funciona?</p>
        <p className="cursor-pointer hover:drop-shadow-lg hover:font-bold">Inicio</p>
      </div>
    </div>
  );
}
