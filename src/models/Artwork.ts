import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type ListingType =
  | "physical_nft_unlockable"
  | "physical_unlockable"
  | "digital_nft"
  | "physical_certificate";

export type Currency = "ETH" | "USD";

// ─── Attributes interface ─────────────────────────────────────────────────────

export interface ArtworkAttributes {
  id: string;
  title: string;
  description?: string | null;
  artist_wallet: string;
  price: number;
  currency: Currency;
  cover_image_url: string;
  listing_type: ListingType;
  unlockable_content_url?: string | null;
  nft_contract_address?: string | null;
  nft_token_id?: string | null;
  is_listed: boolean;
  current_owner_wallet: string;
  // Certificate fields — only populated when listing_type = "physical_certificate"
  cert_title?: string | null;
  cert_description?: string | null;
  cert_artist?: string | null;
  cert_dimensions?: string | null;
  cert_medium?: string | null;
  cert_year?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Model ────────────────────────────────────────────────────────────────────

export class Artwork
  extends Model<InferAttributes<Artwork>, InferCreationAttributes<Artwork>>
  implements ArtworkAttributes
{
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare artist_wallet: string;
  declare price: number;
  declare currency: Currency;
  declare cover_image_url: string;
  declare listing_type: ListingType;
  declare unlockable_content_url: CreationOptional<string | null>;
  declare nft_contract_address: CreationOptional<string | null>;
  declare nft_token_id: CreationOptional<string | null>;
  declare is_listed: CreationOptional<boolean>;
  declare current_owner_wallet: string;
  declare cert_title: CreationOptional<string | null>;
  declare cert_description: CreationOptional<string | null>;
  declare cert_artist: CreationOptional<string | null>;
  declare cert_dimensions: CreationOptional<string | null>;
  declare cert_medium: CreationOptional<string | null>;
  declare cert_year: CreationOptional<number | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof Artwork {
    Artwork.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        artist_wallet: {
          type: DataTypes.STRING(42),
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(18, 8),
          allowNull: false,
        },
        currency: {
          type: DataTypes.ENUM("ETH", "USD"),
          allowNull: false,
        },
        cover_image_url: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        listing_type: {
          type: DataTypes.ENUM(
            "physical_nft_unlockable",
            "physical_unlockable",
            "digital_nft",
            "physical_certificate"
          ),
          allowNull: false,
        },
        unlockable_content_url: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        nft_contract_address: {
          type: DataTypes.STRING(42),
          allowNull: true,
        },
        nft_token_id: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        is_listed: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        current_owner_wallet: {
          type: DataTypes.STRING(42),
          allowNull: false,
        },
        // Certificate columns (flat — MySQL compatible, only set for physical_certificate)
        cert_title: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        cert_description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        cert_artist: {
          type: DataTypes.STRING(42),
          allowNull: true,
        },
        cert_dimensions: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        cert_medium: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        cert_year: {
          type: DataTypes.SMALLINT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "artworks",
        underscored: true,
        timestamps: true,
      }
    );

    return Artwork;
  }
}
