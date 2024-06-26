//import enums
import { Activities, Resources, Role, Shift, Theme } from "@/utils/Enums";

export let themeArray: string[] = [];
  for (let key in Theme) {
    if (isNaN(Number(Theme[key]))) {
      switch (Theme[key]) {
        case "SUPERACAO":
          themeArray.push("Superação");
          break;
        case "ESPERANCA":
          themeArray.push("Esperança");
          break;
        case "GRATIDAO":
          themeArray.push("Gratidão");
          break;
        case "COMPAIXAO":
          themeArray.push("Compaixão");
          break;
        case "FE":
          themeArray.push("Fé");
          break;
        case "DOMINIO_PROPRIO":
          themeArray.push("Dominio Próprio");
          break;
        default:
          themeArray.push(
            Theme[key].charAt(0).toUpperCase() +
              Theme[key].slice(1).toLowerCase()
          );
      }
    }
  }

export let resourcesArray: string[] = [];
  for (let key in Resources) {
    if (isNaN(Number(Resources[key]))) {
      resourcesArray.push(Resources[key]);
    }
  }

export let activitiesDoneArray: string[] = [];
  for (let key in Activities) {
    if (isNaN(Number(Activities[key]))) {
      activitiesDoneArray.push(Activities[key]);
    }
  }

export let rolesArray: string[] = [];
  for (let key in Role) {
    if (isNaN(Number(Role[key]))) {
      rolesArray.push(Role[key]);
    }
  }

export let shiftsArray: string[] = [];
  for (let key in Shift) {
    if (isNaN(Number(Shift[key]))) {
      shiftsArray.push(Shift[key]);
    }
  }

