export interface ModeloPaises {
  // 🔴 AQUÍ ESTABA LA IMAGEN: flag -> url_png / url_svg
  flag?: {
    url_png?: string;
    url_svg?: string;
    emoji?: string;
  };

  names?: {
    common?: string;
    official?: string;
    translations?: {
      spa?: {
        common?: string;
        official?: string;
      };
    };
  };

  capitals?: Array<{
    name?: string;
  }>;

  continents?: string[];
  region?: string;
}