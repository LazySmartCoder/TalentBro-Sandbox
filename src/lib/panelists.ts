const BASE = import.meta.env.BASE_URL;

export const PANELIST_PHOTO_DIR = `${BASE}Panelists/`;

export type PanelistKind = "albert" | "peter" | "daniel" | "maya" | "ada" | "carl" | "atlas";

export const PANELIST_FILES: Record<PanelistKind, string> = {
  albert: "Albert.png",
  peter: "Peter.png",
  daniel: "Daniel.png",
  maya: "Maya.png",
  ada: "Ada.png",
  carl: "Carl.png",
  atlas: "Atlas.jpg",
};

export function panelistPhoto(id: string): string {
  const file = PANELIST_FILES[id as PanelistKind];
  return file ? `${PANELIST_PHOTO_DIR}${file}` : "";
}

export const PANELISTS: {
  id: string;
  name: string;
  gender: "male" | "female";
  img: string;
}[] = [
  { id: "albert", name: "Albert", gender: "male", img: panelistPhoto("albert") },
  { id: "peter", name: "Peter", gender: "male", img: panelistPhoto("peter") },
  { id: "daniel", name: "Daniel", gender: "male", img: panelistPhoto("daniel") },
  { id: "maya", name: "Maya", gender: "female", img: panelistPhoto("maya") },
  { id: "ada", name: "Ada", gender: "female", img: panelistPhoto("ada") },
  { id: "carl", name: "Carl", gender: "male", img: panelistPhoto("carl") },
  { id: "atlas", name: "Atlas", gender: "male", img: panelistPhoto("atlas") },
];