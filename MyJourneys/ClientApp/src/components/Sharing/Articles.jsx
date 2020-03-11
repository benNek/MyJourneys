import React from "react";
import {Link} from "react-router-dom";

export default function Articles() {

  return (
    <div>
      Heya articles are here
      <Link to="/articles/new">Create new articke</Link>
    </div>
  )
}
