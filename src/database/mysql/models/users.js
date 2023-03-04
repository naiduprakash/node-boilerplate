import { DataTypes } from "sequelize";

function usersModel(sequelize) {
	const model = sequelize.define(
		"users",
		{
			id: {
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			username: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			first_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			middle_name: {
				type: DataTypes.STRING,
			},
			last_name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			tableName: "users",
			underscored: true,
			timestamps: true,
			createdAt: "created_at",
			updatedAt: "modified_at",
		}
	);

	return model;
}

export default usersModel;
