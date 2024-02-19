import "@glideapps/glide-data-grid/dist/index.css";

// Dynamically import the DataEditor component

import dynamic from "next/dynamic";

import {
  GridCell,
  GridCellKind,
  GridColumn,
  Item
} from "@glideapps/glide-data-grid";

// now do same with dynamic import
const DataEditor = dynamic(() => import("@glideapps/glide-data-grid"), {
  ssr: false
});

export function ListGlide (){
	return (
		<></>
	)
}

export default ListGlide;
