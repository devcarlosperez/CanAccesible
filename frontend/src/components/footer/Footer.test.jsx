import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer Component", () => {
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  };

  it("should render the logo", () => {
    renderComponent();
    const logo = screen.getByAltText("canaccesible-logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src");
  });

  it("should render the company description text", () => {
    renderComponent();
    expect(
      screen.getByText(
        /CANACCESIBLE promueve un mundo más inclusivo mediante la tecnología/i
      )
    ).toBeInTheDocument();
  });

  it("should render social media links with correct aria-labels", () => {
    renderComponent();

    const youtubeLink = screen.getByLabelText(
      "Visita nuestro canal de YouTube"
    );
    const instagramLink = screen.getByLabelText(
      "Visita nuestro perfil de Instagram"
    );
    const tiktokLink = screen.getByLabelText("Visita nuestro perfil de TikTok");
    const linkedinLink = screen.getByLabelText(
      "Visita nuestro perfil de LinkedIn"
    );

    expect(youtubeLink).toBeInTheDocument();
    expect(youtubeLink).toHaveAttribute(
      "href",
      "https://www.youtube.com/channel/UC_IICs-9f1KYxOuIBQxfQ0g"
    );

    expect(instagramLink).toBeInTheDocument();
    expect(instagramLink).toHaveAttribute(
      "href",
      "https://www.instagram.com/canaccesible/"
    );

    expect(tiktokLink).toBeInTheDocument();
    expect(tiktokLink).toHaveAttribute(
      "href",
      "https://www.tiktok.com/@canaccesible"
    );

    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/canaccesible-el-rinc%C3%B3n-83b8a83a0/"
    );
  });

  it("should render navigation sections", () => {
    renderComponent();

    expect(screen.getByText("Compañía")).toBeInTheDocument();
    expect(screen.getByText("Ayuda")).toBeInTheDocument();

    expect(screen.getByText("Nuestra misión")).toBeInTheDocument();
    expect(screen.getByText("Servicios")).toBeInTheDocument();
    expect(screen.getByText("Sobre nosotros")).toBeInTheDocument();
  });

  it("should render copyright text", () => {
    renderComponent();
    expect(
      screen.getByText(/© CANACCESIBLE 2025, All Rights Reserved/i)
    ).toBeInTheDocument();
  });
});
