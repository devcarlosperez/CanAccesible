import { Link } from "react-router-dom";

const NavLinks = ({ menuItems, showIcons = false }) => {
  return (
    <ul className="flex list-none gap-6 sm:gap-8 md:gap-12 lg:gap-14 xl:gap-16 font-semibold transition-all duration-300">
      {menuItems.map((item) => (
        <li key={item.text}>
          <Link
            to={item.to}
            className="hover:text-accent-3 transition-colors flex items-center gap-1"
          >
            {showIcons && item.icon && (
              <span className="material-symbols-outlined">{item.icon}</span>
            )}
            {item.text}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavLinks;
