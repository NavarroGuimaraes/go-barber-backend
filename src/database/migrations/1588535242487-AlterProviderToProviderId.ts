import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterProviderToProviderId1588535242487
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('appointments', 'provider');
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider_id',
        comment: 'provider_id is the user id which will do the job',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        columnNames: ['provider_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        name: 'provider_user_fk',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    // tipos de on delete: RETRICT = Não permite excluir
    // SET NULL = coloca nulo nos campos que possuem chave estrangeira ao registro deletado
    // CASCADE = Delteta os registros que possuem relação ao registro que foi deletado
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('appointments', 'provider_user_fk');
    await queryRunner.dropColumn('appointments', 'provider_id');
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider',
        type: 'varchar',
      }),
    );
  }
}
